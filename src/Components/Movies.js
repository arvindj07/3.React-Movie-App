import React, { Component } from 'react';
import { getMovies } from './MovieService';
import axios from 'axios';

export default class Movies extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      currSearchText: '',
      currPage: 1,
      limit: 4,
      genres: [{ _id: 'abcd', name: 'All Genres' }],
      cGenre: 'All Genres', // current-genre
    }
  }

  // Component-Did-Mount
  async componentDidMount() {
    console.log('Component DID Mount');
    let res = await axios.get('https://backend-react-movie.herokuapp.com/movies');  // movies
    let genreRes = await axios.get('https://backend-react-movie.herokuapp.com/genres'); // genres
    // get movies-array and genre-array from network req
    this.setState({
      movies: res.data.movies,
      genres: [...this.state.genres, ...genreRes.data.genres],
    })
  }

  // Search movies
  handleChange = (e) => {
    let val = e.target.value;
    this.setState({ currSearchText: val });

    /*We are kind of creating two states for similar content. As the filter movies operation is temporary and occurs with the state change of currSearchText we can simply form the filterMovies array in the render method itself. So there is no need to make it as a state.*/

    // // get Filtered movies using original movies array-> 'movies'
    // let searchMovies = this.state.movies.filter(movie => {
    //   let title=movie.title.trim().toLowerCase();
    //   return title.includes(val.toLowerCase());
    // })
    // // set Filtered Movies-> 'filterMovies'
    // this.setState({ filterMovies: searchMovies });

  }

  // Delete movie based on id
  onDelete = (id) => {
    let n_movies = this.state.movies.filter(movie => {
      return id != movie._id
    })

    this.setState({ movies: n_movies });

  }

  // Sort-> Stock in Inc/Dec order
  sortStock = (e) => {
    let curr_class = e.target.className;
    let n_movies = [...this.state.movies];
    // Decide inc/decreasing order based on className of 'e.target' element
    if (curr_class == 'fas fa-sort-up') {
      // ascending-order
      n_movies.sort(function (a, b) { return a.numberInStock - b.numberInStock });
    } else {
      // decending-order
      n_movies.sort(function (a, b) { return b.numberInStock - a.numberInStock });
    }
    this.setState({ movies: n_movies });
  }

  // Sort-> Rate in Inc/Dec order
  sortRate = (e) => {
    let curr_class = e.target.className;
    let n_movies = [...this.state.movies];
    if (curr_class == 'fas fa-sort-up') {
      n_movies.sort(function (a, b) { return a.dailyRentalRate - b.dailyRentalRate });
    } else {
      n_movies.sort(function (a, b) { return b.dailyRentalRate - a.dailyRentalRate });
    }
    this.setState({ movies: n_movies });
  }

  // Set Current-Page
  handlePageChange = (pageNumber) => {
    this.setState({ currPage: pageNumber });
  }

  // Set-Limit
  handleLimit = (e) => {
    this.setState({ limit: e.target.value });
  }

  // set Genre-change
  handleGenreChange = (genre) => {
    this.setState({
      cGenre: genre
    })
  }

  // Render-Component
  render() {

    let { movies, currSearchText, currPage, limit, genres, cGenre } = this.state; // get State-properties

    // get Filtered-Movies based on Search-Text from movies-Array
    let filteredMovies = movies.filter(movieObj => {
      let title = movieObj.title.trim().toLowerCase();
      return title.includes(currSearchText.toLowerCase());
    })
    //  get Filtered-Movies based on Genre
    if (cGenre != 'All Genres') {
      filteredMovies = filteredMovies.filter(function (movieObj) {
        return movieObj.genre.name == cGenre
      })
    }
    // filter-movies based on CurrPage-limit
    let numberofPage = Math.ceil(filteredMovies.length / limit);
    let pageNumberArr = []; // array , to store page no.s
    for (let i = 0; i < numberofPage; i++) {
      pageNumberArr.push(i + 1);
    }
    let si = (currPage - 1) * limit;
    let ei = si + limit;
    filteredMovies = filteredMovies.slice(si, ei);

    return (
      <>
        { // Display Loader till movies-array get filled using network-request
          this.state.movies.length == 0 ? <div className="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div> :
            <div className='container'>
              <div className='row'>
                {/* sidebar */}
                <div className='col-3'>
                  {/* Genre-List  */}
                  <ul className="list-group">
                    {
                      genres.map((genreObj) => {
                        // to set active-class of selected-Genre
                        let classStyle = genreObj.name == this.state.cGenre ? 'list-group-item active' : 'list-group-item';
                        return (
                          <li onClick={() => this.handleGenreChange(genreObj.name)} key={genreObj._id} className={classStyle}>
                            {genreObj.name}
                          </li>
                        )
                      })
                    }
                  </ul>
                </div>
                {/* Main-Content ie, Input and Table */}
                <div className='col-9'>
                  {/* Search-Movie */}
                  <input type='text' onChange={this.handleChange} value={this.state.currSearchText}></input>
                  {/* Set-Limit  */}
                  <div className="col-auto my-1">
                    <select onChange={this.handleLimit} className="custom-select mr-sm-2" id="inlineFormCustomSelect">
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                    </select>
                  </div>
                  {/* Movie-Table  */}
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">Title</th>
                        <th scope="col">Genre</th>
                        <th scope="col">
                          {/* Inc/Dec order of Stock  */}
                          <i onClick={this.sortStock} className="fas fa-sort-up"></i>
                          Stock
                          <i onClick={this.sortStock} className="fas fa-sort-down"></i>
                        </th>
                        <th scope="col">
                          <i onClick={this.sortRate} className="fas fa-sort-up"></i>
                          Rate
                          <i onClick={this.sortRate} className="fas fa-sort-down"></i>
                        </th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        // Display each Movie-Info in Table in row
                        filteredMovies.map(movieObj => (
                          <tr scope='row' key={movieObj._id}>
                            <td>{movieObj.title}</td>
                            <td>{movieObj.genre.name}</td>
                            <td>{movieObj.numberInStock}</td>
                            <td>{movieObj.dailyRentalRate}</td>
                            <td><button type="button" className="btn btn-danger" onClick={() => { this.onDelete(movieObj._id) }}>Delete</button></td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                  {/* Pagination  */}
                  <nav aria-label="...">
                    <ul className="pagination">
                      {
                        pageNumberArr.map((pageNumber) => {
                          // To set Active-State or Not on Page
                          let classStyle = pageNumber == currPage ? 'page-item active' : 'page-item';
                          return (
                            <li key={pageNumber} onClick={() => this.handlePageChange(pageNumber)} className={classStyle}><span className="page-link">{pageNumber}</span></li>
                          )
                        })
                      }
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
        }
      </>
    )
  }
}
