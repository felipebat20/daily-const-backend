import { prisma } from '../prisma';
import { TaskInterface } from '../interfaces/ITask';
import { SessionInterface } from '../interfaces/ISessions';
import { Project } from '../interfaces/IProject';


class Task {
  public id: string;
  public description: string;
  public createdAt: Date;
  public updatedAt: Date;
  public total_time_spent: number;
  public sessions: SessionInterface[];
  public project: Project | null;

  constructor(task: TaskInterface) {
    this.id = task.id;
    this.description = task.description;
    this.createdAt = task.createdAt;
    this.updatedAt = task.updatedAt;
    this.sessions = task.sessions || [];
    this.project = task.project;
    this.total_time_spent = this.getTotalTimeSpent;
  }

  private getSessionTimeSpent(session) {
    return Math.abs(Math.abs(session.startAt - session.endAt));
  }

  public get getTotalTimeSpent() {
    if (this.sessions.length) {
      return this.sessions
        .map(session => this.getSessionTimeSpent(session))
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
    return tasks.map(task => {
      if (task) {
        return new Task(task);
      }
    });
  }
}

export { Task };
