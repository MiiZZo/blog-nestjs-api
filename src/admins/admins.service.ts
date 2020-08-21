import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Article } from "src/articles/article.entity";
import { Repository, DeleteResult } from "typeorm";

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Article) private articlesRepository: Repository<Article>
  ) {}

  async deleteArticle(id: string): Promise<DeleteResult> {
    return await this.articlesRepository.delete({ id });
  }
}
