# Verilog 赋值内/赋值间延迟

Verilog 延迟语句可以在赋值运算符的左侧或右侧指定延迟。

## 赋值间延迟

```verilog
// Delay is specified on the left side
#<delay> <LHS> = <RHS>
```

赋值间延迟(inter-assignment delay)语句在赋值运算符的 LHS 上具有延迟值。这表示语句本身是在延迟到期后执行的，是最常用的延迟控制形式。

```verilog
module tb;
    reg  a, b, c, q;

    initial begin
        $monitor("[%0t] a=%0b b=%0b c=%0b q=%0b", $time, a, b, c, q);

        // Initialize all signals to 0 at time 0
        a <= 0;
        b <= 0;
        c <= 0;
        q <= 0;

        // Inter-assignment delay: Wait for #5 time units
        // and then assign a and c to 1. Note that 'a' and 'c'
        // gets updated at the end of current timestep
        #5  a <= 1;
            c <= 1;

        // Inter-assignment delay: Wait for #5 time units
        // and then assign 'q' with whatever value RHS gets
        // evaluated to
        #5 q <= a & b | c;

        #20;
    end
endmodule
```

请注意，`q` 在 10 个时间单位时变为 1，因为该语句在 10 个时间单位处被评估，并且作为 `a` 、`b` 和 `c` 的组合的 RHS 评估为 1。

仿真日志：

```bash
[0] a=0 b=0 c=0 q=0
[5] a=1 b=0 c=1 q=0
[10] a=1 b=0 c=1 q=1
```

## 赋值内延迟

```verilog
// Delay is specified on the right side
<LHS> = #<delay> <RHS>
```

赋值内延迟是指赋值运算符的 RHS 存在延迟。这表明首先捕获 RHS 上所有信号的值，评估右侧表达式的值。然后仅在延迟到期后才将其赋给结果信号。

```verilog
module tb;
    reg  a, b, c, q;

    initial begin
        $monitor("[%0t] a=%0b b=%0b c=%0b q=%0b", $time, a, b, c, q);

        // Initialize all signals to 0 at time 0
        a <= 0;
        b <= 0;
        c <= 0;
        q <= 0;

        // Inter-assignment delay: Wait for #5 time units
        // and then assign a and c to 1. Note that 'a' and 'c'
        // gets updated at the end of current timestep
        #5  a <= 1;
            c <= 1;

        // Intra-assignment delay: First execute the statement
        // then wait for 5 time units and then assign the evaluated
        // value to q
        q <= #5 a & b | c;

        #20;
    end
endmodule
```

注意，日志中缺少对 `q` 的赋值！

```verilog
[0] a=0 b=0 c=0 q=0
[5] a=1 b=0 c=1 q=0
```

这是因为在第 5 个时间单位，`a` 和 `c` 是使用非阻塞语句分配的。并且非阻塞语句的行为是评估 RHS，但仅在该时间步结束时才将其分配给变量。

因此，当执行下一个非阻塞语句（即 `q` 的语句）时，`a` 和 `c` 的值被评估为 1，但尚未分配。因此，当评估 `q` 的 RHS 时，`a` 和 `c` 仍然具有旧值 0，因此 `$monitor` 没有检测到显示语句的更改。

为了观察变化，让我们将 a 和 c 的赋值语句从非阻塞更改为阻塞。

```verilog
...

// Non-blocking changed to blocking and rest of the
// code remains the same
    #5  a = 1;
    	c = 1;

    q <= #5 a & b | c;

   	...
```

仿真日志：

```bash
[0] a=0 b=0 c=0 q=0
[5] a=1 b=0 c=1 q=0
[10] a=1 b=0 c=1 q=1
```

