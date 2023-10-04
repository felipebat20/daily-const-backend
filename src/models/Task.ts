import { prisma } from '../prisma';
import { TaskInterface } from '../interfaces/ITask';
import { SessionInterface } from '../interfaces/ISessions';


class Task {
  public id: string;
  public description: string;
  public createdAt: Date;
  public updatedAt: Date;
  public total_time_spent: number;
  public sessions: SessionInterface[];

  constructor(task: TaskInterface) {
    this.id = task.id;
    this.description = task.description;
    this.createdAt = task.createdAt;
    this.updatedAt = task.updatedAt;
    this.sessions = task.sessions || [];
    this.total_time_spent = this.getTotalTimeSpent;
  }

  public get getTotalTimeSpent() {
    if (this.sessions.length) {
      return this.sessions
        .map(session => session.time_spent)
        .reduce((total, current_value) => current_value + total, 0);
    }

    return 0;
  }

  async with(field: string|string[]) {
    if (field instanceof Array) {
      const include = {};
      field.forEach(field => Object.assign(include, { [field]: true }));

      return await prisma.tasks.findUnique({ where: { id: this.id }, include });
    }

    return await prisma.tasks.findUnique({ where: { id: this.id }, include: { [field]: true } });
  }

  static async collection(tasks: TaskInterface[]) {
    const promises = tasks.map(task => prisma.tasks.findUnique({ where: { id: task.id }, include: { sessions: true } }));

    const parsed_tasks = await Promise.all(promises);

    return parsed_tasks.map(task => {
      if (task) {
        return new Task(task);
      }
    });
  }
}

export { Task };
