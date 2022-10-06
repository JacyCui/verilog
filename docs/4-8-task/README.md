# Verilog 任务

函数旨在对输入进行一些处理并返回单个值，而任务更通用，可以计算多个结果值并使用 `output` 和 `inout` 类型参数返回它们。任务可以包含模拟耗时的元素，例如 `@` 、 `posedge` 等。

## 语法

一个任务不需要在端口列表中有一组参数，在这种情况下它可以保持为空。

```verilog
// Style 1
task [name];
	input  [port_list];
	inout  [port_list];
	output [port_list];
	begin
		[statements]
	end
endtask

// Style 2
task [name] (input [port_list], inout [port_list], output [port_list]);
	begin
		[statements]
	end
endtask

// Empty port list
task [name] ();
	begin
		[statements]
	end
endtask
```

### 静态任务

如果一个任务是静态的，那么它的所有成员变量将在已启动并发运行的同一任务的不同调用之间共享。

```verilog
    task sum (input [7:0] a, b, output [7:0] c);
        begin
            c = a + b;
        end
    endtask
    // or
    task sum;
        input  [7:0] a, b;
        output [7:0] c;
        begin
            c = a + b;
        end
    endtask

	initial begin
		reg [7:0] x, y , z;
		sum (x, y, z);
	end
```

任务启用参数 (x, y, z) 对应于任务定义的参数 (a, b, c)。由于 **a** 和 **b** 是输入，**x** 和 **y** 的值将分别放在 **a** 和 **b** 中。因为 **c** 被声明为输出并在调用期间与 **z** 连接，所以总和将自动从 **c** 传递给变量 **z**。

### 自动任务

关键字 `automatic` 将使任务可重入，否则默认为静态。自动任务中的所有项目(items)都是为每次调用动态分配的，并且不会在同时运行的同一任务的调用之间共享。请注意，分层引用无法访问自动任务项。

为了说明，考虑从同时运行的不同 `initial` 块调用的静态任务 `display` 。在这种情况下，在任务中声明的整数变量在任务的所有调用中共享，因此显示的值应该为每次调用增加。

```verilog
module tb;
    initial display();
    initial display();
    initial display();
    initial display();

    // This is a static task
    task display();
        integer i = 0;
        i = i + 1;
        $display("i=%0d", i);
    endtask
endmodule
```

> 注：这种写法需要IEEE1800-2009之后支持的System Verilog。

仿真日志：

```bash
i=1
i=2
i=3
i=4
```

如果任务是自动的，则任务的每次调用都会在模拟内存中分配不同的空间并且行为不同。

```verilog
module tb;

    initial display();
    initial display();
    initial display();
    initial display();

    // Note that the task is now automatic
    task automatic display();
        integer i = 0;
        i = i + 1;
        $display("i=%0d", i);
    endtask

endmodule
```

> 注：这种写法需要IEEE1800-2009之后支持的System Verilog。

仿真日志：

```bash
i=1
i=1
i=1
i=1
```

## 全局任务

在所有模块之外声明的任务称为全局任务，因为它们具有全局范围并且可以在任何模块中调用。

```verilog
// This task is outside all modules
task display();
    $display("Hello World !");
endtask

module des;
    initial begin
        display();
    end
endmodule
```

> 注：这种写法需要IEEE1800-2009之后支持的System Verilog。

仿真日志：

```bash
Hello World !
```

如果任务是在模​​块 `des` 中声明的，则必须通过引用模块实例名称时调用它。

```verilog
module tb;
	des u0();

	initial begin
		u0.display();  // Task is not visible in the module 'tb'
	end
endmodule

module des;
	initial begin
		display(); 	// Task definition is local to the module
	end

	task display();
		$display("Hello World");
	endtask
endmodule
```

仿真日志：

```verilog
Hello World
Hello World
```

## 函数与任务的区别

尽管 Verilog 函数和任务的用途相似，但它们之间存在一些差异。

|函数|任务|
|-|-|
|不能有时间控制语句/延迟，因此在相同的模拟时间单位中执行|可以包含时间控制语句/延迟，并且可能在其他时间完成|
|由于上述规则，无法启用任务|可以启用其他任务和函数|
|应该有至少一个输入参数并且不能有输出或输入输出参数|可以有零个或多个任意类型的参数|
|只能返回一个值|不能返回值，但可以使用输出参数达到相同的效果|

当函数尝试调用任务或包含耗时语句时，编译器会报告错误。

```verilog
module tb;
    reg signal;

    initial wait_for_1(signal);

    function wait_for_1(reg signal);
        #10;
    endfunction
endmodule
```

仿真日志：

```bash
    #10;
    |
xmvlog: *E,BADFCN (testbench.sv,7|4): illegal time/event control statement within a function or final block or analog initial block [10.3.4(IEEE)].
```

## 禁用任务

可以使用 `disable` 关键字禁用任务。

```verilog
module tb;

    initial display();

    initial begin
        // After 50 time units, disable a particular named
        // block T_DISPLAY inside the task called 'display'
        #50 disable display.T_DISPLAY;
    end

    task display();
        begin : T_DISPLAY
            $display("[%0t] T_Task started", $time);
            #100;
            $display("[%0t] T_Task ended", $time);
        end

        begin : S_DISPLAY
            #10;
            $display("[%0t] S_Task started", $time);
            #20;
            $display("[%0t] S_Task ended", $time);
        end
    endtask
endmodule
```

当 `display` 任务由第一个初始块启动时， `T_DISPLAY` 启动并在时间达到 `50` 个单位时被禁用。下一个块 `S_DISPLAY` 立即开始并在第 `80` 个单位时间结束。

仿真日志：

```verilog
[0] T_Task started
[60] S_Task started
[80] S_Task ended
```


