export class Menu {
  static readonly ADMIN = new Menu('Admin');
  static readonly DASHBOARD = new Menu('Dashboard');
  static readonly LEAVE = new Menu('Leave');
  static readonly PIM = new Menu('PIM');
  static readonly TIME = new Menu('Time');
  static readonly RECRUITMENT = new Menu('Recruitment');
  static readonly MY_INFO = new Menu('My Info');

  private constructor(private readonly value: string) {}

  getValue(): string {
    return this.value;
  }
}
