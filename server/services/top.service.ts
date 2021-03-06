import { Top } from "../models/TopModel";
import TopRepository from "../repository/top.repository";
import MovieInTopRepository from "../repository/movieInTop.repository";
import { getCustomRepository, FindManyOptions } from "typeorm";
import { getByIdValues } from "../repository/movieElastic.repository";

export const getTops = async (): Promise<Top[]> =>
  await getCustomRepository(TopRepository).find();

export const getExtendedTops = async (userId?: string): Promise<Top[]> => {
  const options: FindManyOptions = {
    relations: ["movieInTop", "user"],
    order: {
      created_at: "DESC"
    }
  };
  if (userId) {
    options.where = { userId };
  }
  const tops = await getCustomRepository(TopRepository).find(options);

  return await getMoviesInTops(tops, ["id", "title", "release_date"], 100);
};

const getMoviesInTops = async (tops: any, fields: string[], limit: number) => {
  const TopsWithMovies = [...tops];
  for (const top of TopsWithMovies) {
    const movieIds = top.movieInTop.map(top => top.movieId).splice(0, limit);
    const elasticResponse = await getByIdValues(movieIds);
    const movieArray = elasticResponse.hits.hits.map(movie => movie._source);
    top.movieInTop.slice(0, limit).forEach(item => {
      const movie = movieArray.find(movieItem => movieItem.id === item.movieId);
      if (!movie) {
        return;
      }
      item.movie = {};
      fields.forEach(field => {
        item.movie[field] = movie[field];
      });
    });
  }
  return TopsWithMovies;
};

export const getTopById = async (topId: string): Promise<Top> => {
  const top: Top = await getCustomRepository(TopRepository).findOne({
    relations: ["user", "movieInTop"],
    where: { id: topId }
  });
  if (!top) return top;
  const topsWithMovies = await getMoviesInTops(
    [top],
    ["id", "title", "release_date", "poster_path"],
    top.movieInTop.length
  );
  return topsWithMovies[0];
};

export const getRandomTop = async (): Promise<Top> => {
  const top: Top = await getCustomRepository(TopRepository).findOne({
    relations: ["user", "movieInTop"]
  });

  const topsWithMovies = await getMoviesInTops(
    [top],
    ["id", "title", "release_date", "poster_path"],
    top.movieInTop.length
  );
  return topsWithMovies[0];
};

export const getTopByTitle = async (title: string): Promise<Top[]> => {
  const tops: Top[] = await getCustomRepository(TopRepository).find({
    relations: ["user", "movieInTop"],
    where: `title ILIKE '%${title}%'`
  });

  return await Promise.all(
    tops.map(async top => {
      const movieIds = top.movieInTop.map(movie => movie.movieId);
      const elasticResponse = await getByIdValues(movieIds);
      top.movieInTop = elasticResponse.hits.hits.map(movie => movie._source);
      return top;
    })
  );
};

export const getTopsByUserId = async (userId: string): Promise<any[]> => {
  const tops: Top[] = await getCustomRepository(TopRepository).find({
    relations: ["movieInTop"],
    where: { userId }
  });

  return await Promise.all(
    tops.map(async top => {
      const movieIds = top.movieInTop.map(movie => movie.movieId);
      const elasticResponse = await getByIdValues(movieIds);
      top.movieInTop = elasticResponse.hits.hits.map(movie => movie._source);
      return top;
    })
  );
};

export const createTop = async (top: Top): Promise<Top> =>
  await getCustomRepository(TopRepository).save(top);

export const createUserTop = async (top: any): Promise<any> => {
  try {
    const addedTop = {
      title: top.title,
      description: top.description || null,
      topImageUrl: top.topImageUrl || "",
      genreId: top.genreId || null,
      userId: top.userId
    };
    const createdTop: Top = await getCustomRepository(TopRepository).save(
      addedTop
    );
    const moviesInTop = top.movieInTop.map(movie => ({
      topId: createdTop.id,
      comment: movie.comment,
      movieId: movie.id
    }));

    await getCustomRepository(MovieInTopRepository).save(moviesInTop);
    return await getTopById(createdTop.id);
  } catch (e) {
    console.log(e);
  }
};

export const updateTop = async (updatedTop: Top): Promise<Top> => {
  let top: Top = await getCustomRepository(TopRepository).findOne(
    updatedTop.id
  );
  top = updatedTop;
  return await getCustomRepository(TopRepository).save(top);
};

export const updateUserTop = async (top: any): Promise<any> => {
  try {
    const moviesInTop = top.movieInTop.map(movie => ({
      topId: top.id,
      comment: movie.comment,
      movieId: Number.isInteger(movie.id) ? movie.id : movie.movieId
    }));
    delete top.movieInTop;
    await getCustomRepository(TopRepository).save(top);
    await getCustomRepository(MovieInTopRepository).deleteMoviesByTopId(top.id);
    await getCustomRepository(MovieInTopRepository).save(moviesInTop);
    return await getTopById(top.id);
  } catch (e) {
    console.log(e);
  }
};

export const deleteTopById = async (topId: string): Promise<Top> => {
  const top = await getCustomRepository(TopRepository).findOne(topId);
  return await getCustomRepository(TopRepository).remove(top);
};
