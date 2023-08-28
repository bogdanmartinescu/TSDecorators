import { memoize } from "../src/decorators/memoize";

describe("memoize decorator", () => {
  class TestClass {
    callsCount = 0;

    @memoize
    someMethod(n: number): number {
      this.callsCount++;
      return n * n;
    }
  }

  it("should call the function only once for same arguments", () => {
    const instance = new TestClass();

    const firstCall = instance.someMethod(2);
    const secondCall = instance.someMethod(2);

    expect(firstCall).toBe(4);
    expect(secondCall).toBe(4);
    expect(instance.callsCount).toBe(1);
  });

  it("should call the function again for different arguments", () => {
    const instance = new TestClass();

    const firstCall = instance.someMethod(2);
    const secondCall = instance.someMethod(3);

    expect(firstCall).toBe(4);
    expect(secondCall).toBe(9);
    expect(instance.callsCount).toBe(2);
  });

  it("should work with multiple instances of the class", () => {
    const instance1 = new TestClass();
    const instance2 = new TestClass();

    const instance1FirstCall = instance1.someMethod(2);
    const instance2FirstCall = instance2.someMethod(2);

    expect(instance1FirstCall).toBe(4);
    expect(instance2FirstCall).toBe(4);
    expect(instance1.callsCount).toBe(1);
    expect(instance2.callsCount).toBe(1);
  });
});
