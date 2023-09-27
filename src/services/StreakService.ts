import { HttpCode } from '@enum/httpStatusCodes';
import { AppError } from '@exceptions/AppError';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class StreakService {
  async findAllStreaks({ user_id }: { user_id: string }) {
    const streaks = await prisma.streaks.findMany({ where: { user: { id: user_id } } });

    return streaks;
  }

  async createStreak({ user_id, name }: { user_id: string, name: string }) {
    const streak = await prisma.streaks.create({
      data: { name, user: { connect: { id: user_id } } },
    });

    return streak;
  }

  async findStreak({ user_id, streak_id }: { streak_id: string, user_id: string }) {
    const streak = await prisma.streaks.findUnique({ where: { id: streak_id, user: { id: user_id } } });

    if (! streak) {
      throw new AppError({ description: 'Streak not found', httpCode: HttpCode.NOT_FOUND });
    }

    return streak;
  }

  async updateStreak({ user_id, streak_id, name }: { streak_id: string, user_id: string, name: string }) {
    const streak = await prisma.streaks.findUnique({ where: { id: streak_id, user: { id: user_id } } });

    if (! streak) {
      throw new AppError({ description: 'Streak not found', httpCode: HttpCode.NOT_FOUND });
    }

    const updated_streak = await prisma.streaks.update({ data: { name }, where: { id: streak_id } });

    return updated_streak;
  }

  async deleteStreak({ user_id, streak_id }: { streak_id: string, user_id: string }) {
    const streak = await prisma.streaks.findUnique({ where: { id: streak_id, user: { id: user_id } } });

    if (! streak) {
      throw new AppError({ description: 'Streak not found', httpCode: HttpCode.NOT_FOUND });
    }

    const updated_streak = await prisma.streaks.delete({ where: { id: streak_id } });

    return updated_streak;
  }


}

export { StreakService };
