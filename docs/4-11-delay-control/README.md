# Verilog 延迟控制

Verilog 中有两种类型的时序控制——延迟(delay)和事件(event)表达式。延迟控制只是在模拟器遇到语句和实际执行语句之间添加延迟的一种方式。事件表达式允许将语句延迟到某个模拟事件的发生，该事件可以是导线或变量（隐式事件）上的值更改或在另一个过程中触发的显式命名事件。

可以通过以下方法之一来推进模拟时间。

已被建模为具有内部延迟的门和导线也推进了仿真时间。

## 延迟控制

如果延迟表达式计算为未知或高阻抗值，它将被解释为零延迟。如果它的计算结果为负值，它将被解释为对应的补码的无符号整数含义。

```verilog
`timescale 1ns/1ps

module tb;
    reg [3:0] a, b;

    initial begin
        {a, b} <= 0;
        $display ("T=%0t a=%0d b=%0d", $realtime, a, b);

        #10;
        a <= $random;
        $display ("T=%0t a=%0d b=%0d", $realtime, a, b);

        #10 b <= $random;
        $display ("T=%0t a=%0d b=%0d", $realtime, a, b);

        #(a) $display ("T=%0t After a delay of a=%0d units", $realtime, a);
        #(a+b) $display ("T=%0t After a delay of a=%0d + b=%0d = %0d units", $realtime, a, b, a+b);
        #((a+b)*10ps) $display ("T=%0t After a delay of %0d * 10ps", $realtime, a+b);

        #(b-a) $display ("T=%0t Expr evaluates to a negative delay", $realtime);
        #('h10) $display ("T=%0t Delay in hex", $realtime);

        a = 'hX;
        #(a) $display ("T=%0t Delay is unknown, taken as zero a=%h", $realtime, a);

        a = 'hZ;
        #(a) $display ("T=%0t Delay is in high impedance, taken as zero a=%h", $realtime, a);

        #1ps $display ("T=%0t Delay of 10ps", $realtime);
    end

endmodule
```

请注意，时间刻度的精度为 1ps，因此需要 `$realtime` 来显示具有延迟表达式 `(a+b)*10ps` 的语句的精确值。

```bash
T=0 a=x b=x
T=10000 a=0 b=0
T=20000 a=4 b=0
T=24000 After a delay of a=4 units
T=29000 After a delay of a=4 + b=1 = 5 units
T=29050 After a delay of 5 * 10ps
T=42050 Expr evaluates to a negative delay
T=58050 Delay in hex
T=58050 Delay is unknown, taken as zero a=x
T=58050 Delay is in high impedance, taken as zero a=z
T=58051 Delay of 10ps
```

## 事件控制

导线和变量上的值变化可以用作同步事件来触发执行其他程序语句，并且是一个隐式事件。该事件还可以基于变化的方向，例如向 0 方向变化 `negedge` ，向 1 变化 `posedge` 。

-  `negedge` 是指从 1 到 X、Z 或 0 以及从 X 或 Z 到 0 的过渡；
-  `posege` 是指从 0 到 X、Z 或 1 以及从 X 或 Z 到 1 的过渡。

从相同状态到相同状态的转换不被视为沿(edge)。像 `posedge` 或 `negedge` 这样的边缘事件只能在矢量信号或变量的 LSB 上检测到。如果表达式的计算结果和之前相同，则不能将其视为事件。

```verilog
module tb;
    reg a, b;

    initial begin
        a <= 0;

        #10 a <= 1;
        #10 b <= 1;

        #10 a <= 0;
        #15 a <= 1;
    end

    // Start another procedural block that waits for an update to
    // signals made in the above procedural block

    initial begin
        @(posedge a);
        $display ("T=%0t Posedge of a detected for 0->1", $time);
        @(posedge b);
        $display ("T=%0t Posedge of b detected for X->1", $time);
    end

    initial begin
        @(posedge (a + b)) $display ("T=%0t Posedge of a+b", $time);

        @(a) $display ("T=%0t Change in a found", $time);
    end
endmodule
```

仿真日志：

```bash
T=10 Posedge of a detected for 0->1
T=20 Posedge of b detected for X->1
T=30 Posedge of a+b
T=45 Change in a found
```

## 命名事件

关键字 `event` 可用于声明可以显式触发的命名事件。事件不能保存任何数据，没有持续时间，并且可以在任何特定时间发生。命名事件由 `->` 运算符通过在命名事件句柄之前添加前缀来触发。可以使用上述 `@` 运算符等待命名事件。

```verilog
module tb;
    event a_event;
    event b_event[5];

    initial begin
        #20 -> a_event;

        #30;
        ->a_event;

        #50 ->a_event;
        #10 ->b_event[3];
    end

    always @ (a_event) $display ("T=%0t [always] a_event is triggered", $time);

    initial begin
        #25;
        @(a_event) $display ("T=%0t [initial] a_event is triggered", $time);

        #10 @(b_event[3]) $display ("T=%0t [initial] b_event is triggered", $time);
    end
endmodule
```

命名事件可用于同步两个或多个同时运行的进程。例如，`always` 块和第二个初始块通过 `a_event` 同步。事件可以声明为数组，就像 `b_event` 的情况一样，它是一个大小为 5 的数组，索引 3 用于触发和等待目的。

仿真日志：

```bash
T=20 [always] a_event is triggered
T=50 [always] a_event is triggered
T=50 [initial] a_event is triggered
T=100 [always] a_event is triggered
T=110 [initial] b_event is triggered
```

## or 运算符

`or` 运算符可用于等待直到在表达式中触发任何列出的事件。逗号 `,` 也可以用来代替 `or` 运算符。

```verilog
module tb;
    reg a, b;

    initial begin
        $monitor ("T=%0t a=%0d b=%0d", $time, a, b);
        {a, b} <= 0;

        #10 a <= 1;
        #5  b <= 1;
        #5  b <= 0;
    end

    // Use "or" between events
    always @ (posedge a or posedge b)
        $display ("T=%0t posedge of a or b found", $time);

    // Use a comma between
    always @ (posedge a, negedge b)
        $display ("T=%0t posedge of a or negedge of b found", $time);

    always @ (a, b)
        $display ("T=%0t Any change on a or b", $time);
endmodule
```

仿真日志：

```bash
T=0 posedge of a or negedge of b found
T=0 Any change on a or b
T=0 a=0 b=0
T=10 posedge of a or b found
T=10 posedge of a or negedge of b found
T=10 Any change on a or b
T=10 a=1 b=0
T=15 posedge of a or b found
T=15 Any change on a or b
T=15 a=1 b=1
T=20 posedge of a or negedge of b found
T=20 Any change on a or b
T=20 a=1 b=0
```

## 隐式事件表

敏感度列表(sensitibity list)或事件表达式列表(event expression list)是 RTL 中许多功能性错误的常见原因。这是因为用户在程序块中引入新信号后可能会忘记更新敏感度列表。

```verilog
module tb;
	reg a, b, c, d;
	reg x, y;

	// Event expr/sensitivity list is formed by all the
	// signals inside () after @ operator and in this case
	// it is a, b, c or d
	always @ (a, b, c, d) begin
		x = a | b;
		y = c ^ d;
	end

	initial begin
		$monitor ("T=%0t a=%0b b=%0b c=%0b d=%0b x=%0b y=%0b", $time, a, b, c, d, x, y);
		{a, b, c, d} <= 0;

		#10 {a, b, c, d} <= $random;
		#10 {a, b, c, d} <= $random;
		#10 {a, b, c, d} <= $random;
	end
endmodule
```

仿真日志：

```bash
T=0 a=0 b=0 c=0 d=0 x=0 y=0
T=10 a=0 b=1 c=0 d=0 x=1 y=0
T=20 a=0 b=0 c=0 d=1 x=0 y=1
T=30 a=1 b=0 c=0 d=1 x=1 y=1
```

如果用户决定添加新信号 `e` 并将逆信号捕获到 `z` 中，则必须特别注意将 `e` 也添加到敏感度列表中。

```verilog
module tb;
    reg a, b, c, d, e;
    reg x, y, z;

    // Add "e" also into sensitivity list
    always @ (a, b, c, d, e) begin
        x = a | b;
        y = c ^ d;
        z = ~e;
    end

    initial begin
        $monitor ("T=%0t a=%0b b=%0b c=%0b d=%0b e=%0b x=%0b y=%0b z=%0b",
                                    $time, a, b, c, d, e, x, y, z);
        {a, b, c, d, e} <= 0;

        #10 {a, b, c, d, e} <= $random;
        #10 {a, b, c, d, e} <= $random;
        #10 {a, b, c, d, e} <= $random;
    end
endmodule
```

仿真日志：

```bash
T=0 a=0 b=0 c=0 d=0 e=0 x=0 y=0 z=1
T=10 a=0 b=0 c=1 d=0 e=0 x=0 y=1 z=1
T=20 a=0 b=0 c=0 d=0 e=1 x=0 y=0 z=0
T=30 a=0 b=1 c=0 d=0 e=1 x=1 y=0 z=0
```

Verilog 现在允许将敏感度列表替换为 `*` ，这是一种方便的简写，通过添加语句读取的所有导线和变量来消除这些问题，如下所示。

```verilog
module tb;
	reg a, b, c, d, e;
	reg x, y, z;

    // Use @* or @(*)
    always @ * begin
        x = a | b;
        y = c ^ d;
        z = ~e;
    end

	initial begin
        $monitor ("T=%0t a=%0b b=%0b c=%0b d=%0b e=%0b x=%0b y=%0b z=%0b",
                                    $time, a, b, c, d, e, x, y, z);
        {a, b, c, d, e} <= 0;

        #10 {a, b, c, d, e} <= $random;
        #10 {a, b, c, d, e} <= $random;
        #10 {a, b, c, d, e} <= $random;
	end
endmodule
```

仿真日志：

```bash
T=0 a=0 b=0 c=0 d=0 e=0 x=0 y=0 z=1
T=10 a=0 b=0 c=1 d=0 e=0 x=0 y=1 z=1
T=20 a=0 b=0 c=0 d=0 e=1 x=0 y=0 z=0
T=30 a=0 b=1 c=0 d=0 e=1 x=1 y=0 z=0
```

## 条件事件

程序语句的执行也可以延迟到某个条件变为真的时候，并且可以使用 `wait` 关键字完成。

`wait` 语句将评估(evaluate)一个条件表达式，如果它为假，则它后面的程序语句将保持阻塞，直到条件变为真为止。

```verilog
module tb;
    reg [3:0] ctr;
    reg clk;

    initial begin
        {ctr, clk} <= 0;

        wait (ctr);
        $display ("T=%0t Counter reached non-zero value 0x%0h", $time, ctr);

        wait (ctr == 4) $display ("T=%0t Counter reached 0x%0h", $time, ctr);

        $finish;
    end

    always #10 clk = ~clk;

    always @ (posedge clk)
        ctr <= ctr + 1;
endmodule
```

仿真日志：

```bash
T=10 Counter reached non-zero value 0x1
T=70 Counter reached 0x4
```

