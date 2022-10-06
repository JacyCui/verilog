# Verilog 层级引用域

大多数编程语言都有一个称为作用域(scope)的特征，它定义了某些代码部分对变量和方法的可见性。作用域定义了一个命名空间，以避免同一命名空间内不同对象名称之间的冲突。

Verilog 为模块、函数、任务、命名块和生成块定义了一个新的作用域。

```verilog
module tb;
	reg signal;

	// Another variable cannot be declared with
	// an already existing name in the same scope
	reg signal;

	// However, the name 'signal' can be reused inside
	// a task because it belongs to a different scope.
	task display();
		reg signal = 1;
		$display("signal = %0b", signal);
	endtask
endmodule
```

标识符，如信号名称，在一个作用域内仅能声明一种类型的对象(item)。这意味着，在同一作用域呢，不同或相同数据类型的两个变量不能同名，任务、实例、导线等等各种元件在同一作用域内都不可以同名。

Verilog 中的每个标识符都有一个唯一的分层路径名，其中每个模块实例、任务、函数或命名的 `begin end` 或 `fork join` 块定义一个新的级别或作用域。

## 层级引用示例

```verilog
module tb;
	// Create two instances of different modules
	A uA();
	B uB();

	// Create a named block that declares a signal and
	// prints the value at 10ns from simulation start
	initial begin : TB_INITIAL
        reg signal;
        #10 $display("signal=%0d", signal);
	end

  	// We'll try to access other scopes using hierarchical
  	// references from this initial block
  	initial begin
        TB_INITIAL.signal = 0;
        uA.display();

        uB.B_INITIAL.B_INITIAL_BLOCK1.b_signal_1 = 1;
        uB.B_INITIAL.B_INITIAL_BLOCK2.b_signal_2 = 0;
    end
endmodule
```

```verilog
module A;
	task display();
		$display("Hello, this is A");
	endtask
endmodule

module B;
	initial begin : B_INITIAL
		#50;
		begin : B_INITIAL_BLOCK1
			reg b_signal_1;
            #10 $display("signal_1=%0d", b_signal_1);
		end

		#50;
		begin : B_INITIAL_BLOCK2
			reg b_signal_2;
            #10 $display("signal_2=%0d", b_signal_2);
		end
	end
endmodule
```

仿真日志：

```bash
Hello, this is A
TB signal=0
signal_1=1
signal_2=0
```

## 向上名引用

较低级别的模块可以引用层次结构中高于它的模块中的项目。例如，`TB_INITIAL` 块中的信号可以从 `A` 中的显示任务中看到。

```verilog
module A;
	task display();
		$display("Hello, this is A");

        // Upward referencing, TB_INITIAL is visible in this module
      	#5 TB_INITIAL.signal = 1;
	endtask
endmodule
```

注意， `TB signal` 现在为 1 而不是 0，因为模块 `A` 对信号进行了向上引用更改。

仿真日志：

```bash
Hello, this is A
TB signal=1
signal_1=1
signal_2=0
```

这是另一个具有多个嵌套模块的示例，叶子节点可以通过向上的分层引用直接访问上面节点的成员。

```verilog
module tb;
    A a();

    function display();
        $display("Hello, this is TB");
    endfunction
endmodule

module A;
    B b();
    function display();
        $display("Hello, this is A");
    endfunction
endmodule

module B;
    C c();
    function display();
        $display("Hello, this is B");
    endfunction
endmodule

module C;
    D d();

    function display();
        $display("Hello, this is C");
    endfunction
endmodule

module D;
    initial begin
        a.display();  // or A.display()
        b.display();  // or B.display()
        c.display();  // or C.display()

        a.b.c.display();
    end
endmodule
```

仿真日志：

```bash
Hello, this is A
Hello, this is B
Hello, this is C
Hello, this is C
```

当编译器找到 `b.display()` 时，

- 它在模块 `D` 的当前作用域内查看是否定义了 `b`。如果不存在，则在向上一层作用域内查找名称并逐次向上移动，直到到达模块作用域。如果仍未找到该名称，则进入下一步。
- 它在父模块的最外层作用域内查找，如果找不到，它会继续转向更高层级。

