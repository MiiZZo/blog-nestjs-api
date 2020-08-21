import { Injectable, ForbiddenException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Article } from "./article.entity";
import { Repository, DeleteResult } from "typeorm";
import { CreateArticleDto } from "./dto/create-article.dto";
import { User } from "src/users/user.entity";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { Comment } from "./comment.entity";
import { ArticleDto } from "./dto/article.dto";

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article) private articlesRepository: Repository<Article>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Comment) private commentsRepository: Repository<Comment>
  ) {}

  async getAll(): Promise<Article[]> {
    return await this.articlesRepository.find({ order: { created: "DESC" } });
  }

  async findOne(id: string): Promise<ArticleDto> {
    const {
      author: { role, password, email, ...author },
      ...article
    } = await this.articlesRepository.findOne(id, { relations: ["author"] });

    return { author, ...article };
  }

  async create(
    articleDto: CreateArticleDto,
    authorId: string
  ): Promise<Article> {
    const article = this.articlesRepository.create({
      ...articleDto,
      comments: []
    });

    const newArticle = await this.articlesRepository.save(article);
    const author = await this.usersRepository.findOne({
      where: { id: authorId },
      relations: ["articles"]
    });

    author.articles.push(article);

    await this.usersRepository.save(author);

    return newArticle;
  }

  async delete(articleId: string, userId: string): Promise<DeleteResult> {
    const article = await this.articlesRepository.findOne(articleId, {
      relations: ["author"]
    });

    if (article.author.id !== userId) {
      throw new ForbiddenException();
    }

    return await this.articlesRepository.delete({ id: articleId });
  }

  async addComment(
    articleId: string,
    commentData: CreateCommentDto,
    userId: string
  ): Promise<Article> {
    let article = await this.articlesRepository.findOne({ id: articleId }, { relations: ["author"] });
    const comment = this.commentsRepository.create({  });

    article.comments.push(comment);
    await this.commentsRepository.save(comment);

    article = await this.articlesRepository.save(article);
    return article;
  }

  async deleteComment(articleId: string, commentId: string): Promise<Article> {
    let article = await this.articlesRepository.findOne(articleId);

    const comment = await this.commentsRepository.findOne(commentId);
    const deleteIndex = article.comments.findIndex(
      _comment => _comment.id === comment.id
    );

    if (deleteIndex >= 0) {
      const deleteComments = article.comments.splice(deleteIndex, 1);
      await this.commentsRepository.delete(deleteComments[0].id);

      article = await this.articlesRepository.save(article);
    }

    return article;
  }
}
