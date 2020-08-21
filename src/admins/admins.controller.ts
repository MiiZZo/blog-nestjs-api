import { Controller, Param, Post, UseGuards } from "@nestjs/common";
import { AdminsService } from "./admins.service";
import { RolesGuard } from "@shared/role.guard";
import { Roles } from "@shared/role.decorator";

@Roles("admin")
@UseGuards(RolesGuard)
@Controller("admins")
export class AdminsController {
  constructor(private adminsService: AdminsService) {}

  @Post(":id")
  async deleteArticle(@Param("id") articleId: string): Promise<void> {
    this.adminsService.deleteArticle(articleId);
  }
}
