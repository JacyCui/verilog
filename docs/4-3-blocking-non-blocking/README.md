# Verilog 阻塞/非阻塞

## 阻塞赋值

阻塞赋值语句使用 `=` 赋值，并在程序块中一个接一个地执行。但是，这不会阻止执行在并行块中运行的语句。

```verilog
module tb;
    reg [7:0] a, b, c, d, e;

    initial begin
        a = 8'hDA;
        $display ("[%0t] a=0x%0h b=0x%0h c=0x%0h", $time, a, b, c);
        b = 8'hF1;
        $display ("[%0t] a=0x%0h b=0x%0h c=0x%0h", $time, a, b, c);
        c = 8'h30;
        $display ("[%0t] a=0x%0h b=0x%0h c=0x%0h", $time, a, b, c);
    end

    initial begin
        d = 8'hAA;
        $display ("[%0t] d=0x%0h e=0x%0h", $time, d, e);
        e = 8'h55;
        $display ("[%0t] d=0x%0h e=0x%0h", $time, d, e);
    end
endmodule
```

请注意，有两个 `initial` 块在仿真开始时并行执行。语句在每个块中按顺序执行，两个块都在时间 0ns 完成。更具体地说，首先分配变量 `a` ，然后是 `display` 语句，然后是所有其他语句。这在输出中可见，其中变量 `b` 和 `c` 在第一个显示语句中是 `8'hxx` 。这是因为在调用第一个 `$display` 时尚未执行变量 `b` 和 `c` 的赋值。

仿真日志：

```bash
[0] a=0xda b=0xx c=0xx
[0] a=0xda b=0xf1 c=0xx
[0] a=0xda b=0xf1 c=0x30
[0] d=0xaa e=0xx
[0] d=0xaa e=0x55
```

在下一个示例中，我们将在同一组语句中添加一些延迟，以查看其行为方式。

```verilog
module tb;
    reg [7:0] a, b, c, d, e;

    initial begin
        a = 8'hDA;
        $display ("[%0t] a=0x%0h b=0x%0h c=0x%0h", $time, a, b, c);
        #10 b = 8'hF1;
        $display ("[%0t] a=0x%0h b=0x%0h c=0x%0h", $time, a, b, c);
        c = 8'h30;
        $display ("[%0t] a=0x%0h b=0x%0h c=0x%0h", $time, a, b, c);
    end

    initial begin
        #5 d = 8'hAA;
        $display ("[%0t] d=0x%0h e=0x%0h", $time, d, e);
        #5 e = 8'h55;
        $display ("[%0t] d=0x%0h e=0x%0h", $time, d, e);
    end
endmodule
```

仿真日志：

```verilog
[0] a=0xda b=0xx c=0xx
[5] d=0xaa e=0xx
[10] a=0xda b=0xf1 c=0xx
[10] a=0xda b=0xf1 c=0x30
[10] d=0xaa e=0x55
```

## 非阻塞赋值

非阻塞赋值允许在不阻塞执行后续语句的情况下调度赋值，并由 `<=` 符号指定。有趣的是，相同的符号在表达式中用作关系运算符，在非阻塞赋值的上下文中用作赋值运算符。如果我们采用上面的第一个示例，将所有 `=` 符号替换为非阻塞赋值运算符 `<=` ，我们将看到输出有所不同。

```verilog
module tb;
    reg [7:0] a, b, c, d, e;

    initial begin
        a <= 8'hDA;
        $display ("[%0t] a=0x%0h b=0x%0h c=0x%0h", $time, a, b, c);
        b <= 8'hF1;
        $display ("[%0t] a=0x%0h b=0x%0h c=0x%0h", $time, a, b, c);
        c <= 8'h30;
        $display ("[%0t] a=0x%0h b=0x%0h c=0x%0h", $time, a, b, c);
    end

    initial begin
        d <= 8'hAA;
        $display ("[%0t] d=0x%0h e=0x%0h", $time, d, e);
        e <= 8'h55;
        $display ("[%0t] d=0x%0h e=0x%0h", $time, d, e);
    end
endmodule
```

看到所有的 `$display` 语句都打印了 `x` 。这种行为的原因在于非阻塞赋值的执行方式。捕获特定时间步的每个非阻塞语句的 RHS，并继续执行下一条语句。仅在时间步结束时将捕获的 RHS 值分配给 LHS 变量。

仿真日志：

```bash
[0] a=0xx b=0xx c=0xx
[0] a=0xx b=0xx c=0xx
[0] a=0xx b=0xx c=0xx
[0] d=0xx e=0xx
[0] d=0xx e=0xx
```

因此，如果我们分解上述示例的执行流程，我们将得到如下所示的内容。

```bash
|__ Spawn Block1: initial
|      |___ Time #0ns : a <= 8'DA, is non-blocking so note value of RHS (8'hDA) and execute next step
|      |___ Time #0ns : $display() is blocking, so execute this statement: But a hasn't received new values so a=8'hx
|      |___ Time #0ns : b <= 8'F1, is non-blocking so note value of RHS (8'hF1) and execute next step
|      |___ Time #0ns : $display() is blocking, so execute this statement. But b hasn't received new values so b=8'hx
|      |___ Time #0ns : c <= 8'30, is non-blocking so note value of RHS (8'h30) and execute next step
|      |___ Time #0ns : $display() is blocking, so execute this statement. But c hasn't received new values so c=8'hx
|      |___ End of time-step and initial block, assign captured values into variables a, b, c
|
|__ Spawn Block2: initial
|      |___ Time #0ns : d <= 8'AA, is non-blocking so note value of RHS (8'hAA) and execute next step
|      |___ Time #0ns : $display() is blocking, so execute this statement: But d hasn't received new values so d=8'hx
|      |___ Time #0ns : e <= 8'55, is non-blocking so note value of RHS (8'h55) and execute next step
|      |___ Time #0ns : $display() is blocking, so execute this statement. But e hasn't received new values so e=8'hx
|      |___ End of time-step and initial block, assign captured values into variables d and e
|
|__ End of simulation at #0ns
```

接下来，让我们使用第二个示例，将所有阻塞语句替换为非阻塞语句。

```verilog
module tb;
    reg [7:0] a, b, c, d, e;

    initial begin
        a <= 8'hDA;
        $display ("[%0t] a=0x%0h b=0x%0h c=0x%0h", $time, a, b, c);
        #10 b <= 8'hF1;
        $display ("[%0t] a=0x%0h b=0x%0h c=0x%0h", $time, a, b, c);
        c <= 8'h30;
        $display ("[%0t] a=0x%0h b=0x%0h c=0x%0h", $time, a, b, c);
    end

    initial begin
        #5 d <= 8'hAA;
        $display ("[%0t] d=0x%0h e=0x%0h", $time, d, e);
        #5 e <= 8'h55;
        $display ("[%0t] d=0x%0h e=0x%0h", $time, d, e);
    end
endmodule
```

我们再次可以看到输出与我们之前得到的不同。

```verilog
[0] a=0xx b=0xx c=0xx
[5] d=0xx e=0xx
[10] a=0xda b=0xx c=0xx
[10] a=0xda b=0xx c=0xx
[10] d=0xaa e=0xx
```

如果我们分解执行流程，我们将得到如下所示的内容。

```bash
|__ Spawn Block1 at #0ns: initial
|      |___ Time #0ns : a <= 8'DA, is non-blocking so note value of RHS (8'hDA) and execute next step
|      |___ Time #0ns : $display() is blocking, so execute this statement: But a hasn't received new values so a=8'hx
|      |___ End of time-step : Assign captured value to variable a, and a is now 8'hDA
|      |___ Wait until time advances by 10 time-units to #10ns
|	
|      |___ Time #10ns : b <= 8'F1, is non-blocking so note value of RHS (8'hF1) and execute next step
|      |___ Time #10ns : $display() is blocking, so execute this statement. But b hasn't received new values so b=8'hx
|	   |___ Time #10ns : c <= 8'30, is non-blocking so note value of RHS (8'h30) and execute next step
|      |___ Time #10ns : $display() is blocking, so execute this statement. But c hasn't received new values so c=8'hx
|      |___ End of time-step and initial block, assign captured values into variables b, c
|	
|__ Spawn Block2 at #0ns: initial
|      |___ Wait until time advances by 5 time-units to #5ns
|	
|      |___ Time #5ns : d <= 8'AA, is non-blocking so note value of RHS (8'hAA) and execute next step
|      |___ Time #5ns : $display() is blocking, so execute this statement: But d hasn't received new values so d=8'hx
|      |___ End of time-step : Assign captured value to variable d, and d is now 8'hAA
|      |___ Wait until time advances by 5 time-units to #5ns
|	
|      |___ Time #10ns : e <= 8'55, is non-blocking so note value of RHS (8'h55) and execute next step
|      |___ Time #10ns : $display() is blocking, so execute this statement. But e hasn't received new values so e=8'hx
|      |___ End of time-step and initial block, assign captured values to variable e, and e is now 8'h55
|
|__ End of simulation at #10ns
```


