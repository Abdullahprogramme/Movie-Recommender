const Filter = (movies, answers, genreToId) => {

    const filtered = movies.filter(movie => {
      // Filter by genre
      if (answers.genre && !movie.genre_ids.includes(genreToId(answers.genre))) {
        return false;
      }

      // Filter by period
      if (answers.period) {
        const year = parseInt(movie.release_date.substring(0, 4));
        if ((answers.period === 'Before 2000' && year >= 2000) ||
            (answers.period === '2000-2010' && (year < 2000 || year > 2010)) ||
            (answers.period === 'After 2010' && year <= 2010)) {
          return false;
        }
      }

      // Filter by TMDB rating
      if (answers.highRating === 'Yes' && movie.vote_average < 7) {
        return false;
      }

      // Filter by critical acclaim
      if (answers.criticalAcclaim === 'Yes' && movie.vote_count < 1000) {
        return false;
      }

      // If the movie passed all checks, include it in the filtered list
      return true;
    });


};

export default Filter;