const Filter = (movies, answers, genreToId) => {
  console.log('Running Filter function with answers:', answers); // Add this line
    
    // const filtered = movies.filter(movie => {
      if (!answers || (!answers.genre && !answers.period && !answers.highRating && !answers.criticalAcclaim) {
        return movies;  // If answers or answers.genre is not defined, return the original movie list
      }
  
      let filtered = movies;
      // Filter by genre first
      if (answers.genre) {
        filtered = filtered.filter(movie => {
          for (let i = 0; i < answers.genre.length; i++) {
            if (movie.genre_ids && movie.genre_ids.includes(genreToId(answers.genre[i]))) {
              return true;
            }
          }
          return false;
        });
        console.log('After genre filter:', filtered.length); // Add this line
      }

      /// Filter by period
      if (answers.period) {
        filtered = filtered.filter(movie => {
          const year = parseInt(movie.release_date.substring(0, 4));
          return answers.period.some(period => {
              if (period === 'Before 2000' && year < 2000) {
                  return true;
              }
              if (period === '2000-2010' && (year >= 2000 && year <= 2010)) {
                  return true;
              }
              if (period === 'After 2010' && year > 2010) {
                  return true;
              }
              return false;
          });
      });
        console.log('After period filter:', filtered.length); // Add this line
      }

      // Filter by TMDB rating
      if (answers.highRating) {
        filtered = filtered.filter(movie => {
        if (answers.highRating[0] === 'Yes' && movie.vote_average >= 7) {
          return true;
        }
        if (answers.highRating[0] === 'No' && movie.vote_average < 7) {
          return true;
        }
        return false;
      });
      console.log('After highRating filter:', filtered.length); // Add this line
    }

      // Filter by critical acclaim
      if (answers.criticalAcclaim) {
        filtered = filtered.filter(movie => {
        if (answers.criticalAcclaim[0] === 'Yes' && movie.vote_count >= 1000) {
          return true;
        }
        if (answers.criticalAcclaim[0] === 'No' && movie.vote_count < 1000) {
          return true;
        }
        return false;
      });
      console.log('After criticalAcclaim filter:', filtered.length); // Add this line
    }


// });
  
  return filtered;
};

export default Filter;
