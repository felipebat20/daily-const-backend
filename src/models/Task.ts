import { Tasks } from '@prisma/client';

import { prisma } from '../prisma';

class Task {
  public task;
  constructor(task: Tasks) {
    this.task = task;
  }

  async with(field: string|string[]) {
    if (field instanceof Array) {
      const include = {};
      field.forEach(field => Object.assign(include, { [field]: true }));

      return await prisma.tasks.findUnique({ where: { id: this.task.id }, include });
    }

    return await prisma.tasks.findUnique({ where: { id: this.task.id }, include: { [field]: true } });
  }
}

export { Task };
