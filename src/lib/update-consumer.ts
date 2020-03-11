export interface UpdateConsumer<T> {
  consume(update: T): this;
}
