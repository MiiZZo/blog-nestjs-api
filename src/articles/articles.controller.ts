import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Req,
  UseGuards,
  UseInterceptors,
  Query
} from "@nestjs/common";
import { Article } from "./article.entity";
import { ArticlesService } from "./articles.service";
import { CreateArticleDto } from "./dto/create-article.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { IReq } from "@shared/request.interface";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { NotFoundInterceptor } from "@shared/not-found.Interceptor";
import { ArticleDto } from "./dto/article.dto";
import { DeleteResult } from "typeorm";

@Controller("articles")
export class ArticlesController {
  constructor(private articlesService: ArticlesService) {}

  @Get("/get-all")
  async getArticles(
    @Query("page") page: string
  ): Promise<{
    articles: Article[];
    pageNumber: number;
    pageCount: number;
  }> {
    const articles = await this.articlesService.getAll();
    const articlesCount = articles.length;
    const perPage = 10;
    const pageCount = Math.ceil(articlesCount / perPage);
    let pageNumber = parseInt(page);

    if (isNaN(pageNumber) || pageNumber < 0) {
      pageNumber = 1;
    }

    if (pageNumber > pageCount) {
      pageNumber = pageCount;
    }

    return {
      articles: articles.slice(
        (pageNumber - 1) * perPage,
        (pageNumber - 1) * perPage + perPage
      ),
      pageNumber,
      pageCount
    };
  }

  @Get(":id")
  @UseInterceptors(new NotFoundInterceptor("Article not found"))
  async getOne(@Param("id") id: string): Promise<ArticleDto> {
    return await this.articlesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Req() req: IReq,
    @Body() article: CreateArticleDto
  ): Promise<Article> {
    const createdArticle = await this.articlesService.create(article, req.user.id);
    return createdArticle;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async delete(
    @Req() req: IReq,
    @Param("id") id: string
  ): Promise<DeleteResult> {
    return await this.articlesService.delete(id, req.user.id);
  }

  // @Post(":id/favorite")
  // async favorite(@Req() req: Request, @Param("id") id: string): Promise<void> {
  //   await this.articlesService.favorite(id, (req as any).user.id);
  // }

  // @Delete(":id/favorite")
  // async unFavorite(
  //   @Req() req: Request,
  //   @Param("id") id: string
  // ): Promise<void> {
  //   return await this.articlesService.unFavorite(id, (req as any).user.id);
  // }

  @UseGuards(JwtAuthGuard)
  @Post(":articleId/comments")
  async createComment(
    @Req() req: IReq,
    @Param("articleId") articleId: string,
    @Body() comment: CreateCommentDto
  ): Promise<Article> {
    return await this.articlesService.addComment(articleId, comment, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":articleId/comments/:id")
  async deleteComment(
    @Param("articleId") articleId: string,
    @Param("id") id: string
  ): Promise<Article> {
    return await this.articlesService.deleteComment(articleId, id);
  }
}
