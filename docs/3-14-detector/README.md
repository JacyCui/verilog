# Verilog 检测器

FSM（Finite State Machine，有限状态机） 的一个非常常见的示例是序列检测器(sequence detector)，其中硬件设计应检测何时在输入到它的二进制位流中看到固定模式。

## 序列检测器示例

### 设计

```verilog
module det_1011 ( input clk,
                  input rstn,
                  input in,
                  output out );

    parameter IDLE 	    = 0,
              S1 		= 1,
              S10 	    = 2,
              S101 	    = 3,
              S1011 	= 4;

    reg [2:0] cur_state, next_state;

    assign out = cur_state == S1011 ? 1 : 0;

    always @ (posedge clk) begin
        if (!rstn)
            cur_state <= IDLE;
        else
            cur_state <= next_state;
    end

    always @ (cur_state or in) begin
        case (cur_state)
            IDLE : begin
                if (in) 
                    next_state = S1;
                else 
                    next_state = IDLE;
            end

            S1: begin
                if (in) 
                    next_state = IDLE;
                else 	
                    next_state = S10;
            end

            S10 : begin
                if (in) 
                    next_state = S101;
                else 	
                    next_state = IDLE;
            end

            S101 : begin
                if (in) 
                    next_state = S1011;
                else 	
                    next_state = IDLE;
            end

            S1011: begin
                next_state = IDLE;
            end
        endcase
    end
endmodule
```

### 测试台

```verilog
module tb;
    reg 			clk, in, rstn;
    wire 			out;
    reg [1:0]       l_dly;
    reg 			tb_in;
    integer 	    loop = 1;

    always #10 clk = ~clk;

    det_1011 u0 (.clk(clk), .rstn(rstn), .in(in), .out(out));

    initial begin
        clk <= 0;
        rstn <= 0;
        in <= 0;

        repeat (5)
            @ (posedge clk);
        rstn <= 1;

        // Generate a directed pattern
        @(posedge clk) in <= 1;
        @(posedge clk) in <= 0;
        @(posedge clk) in <= 1;
        @(posedge clk) in <= 1; 		// Pattern is completed
        @(posedge clk) in <= 0;
        @(posedge clk) in <= 0;
        @(posedge clk) in <= 1;
        @(posedge clk) in <= 1;
        @(posedge clk) in <= 0;
        @(posedge clk) in <= 1;
        @(posedge clk) in <= 1; 	   // Pattern completed again

        // Or random stimulus using a for loop that drives a random
        // value of input N times
        for (int i = 0 ; i < loop; i ++) begin
            l_dly = $random;
            repeat (l_dly)
                @ (posedge clk);
            tb_in = $random;
            in <= tb_in;
        end

        // Wait for sometime before quitting simulation
        #100 $finish;
    end
endmodule
```

仿真日志：

```bash
T=10 in=0 out=0
T=30 in=0 out=0
T=50 in=0 out=0
T=70 in=0 out=0
T=90 in=0 out=0
T=110 in=1 out=0
T=130 in=0 out=0
T=150 in=1 out=0
T=170 in=1 out=0
T=190 in=0 out=1
T=210 in=0 out=0
T=230 in=1 out=0
T=250 in=1 out=0
T=270 in=0 out=0
T=290 in=1 out=0
T=310 in=1 out=0
T=330 in=1 out=1
T=350 in=1 out=0
T=370 in=1 out=0
T=390 in=1 out=0
```

在上述设计中有一个 bug ，你能发现吗？（提示：考虑两个连续的目标序列）

## 模式检测器示例

前面的示例探索了一个简单的序列检测器。这是检测稍长模式的模式检测器的另一个示例。

### 设计

```verilog
module det_110101 ( input  clk,
                  	input  rstn,
                  	input  in,
                  	output out );

    parameter   IDLE 	= 0,
                S1 		= 1,
                S11 	= 2,
                S110 	= 3,
                S1101 	= 4,
                S11010 	= 5,
                S110101 = 6;

    reg [2:0] cur_state, next_state;

    assign out = cur_state == S110101 ? 1 : 0;

    always @ (posedge clk) begin
        if (!rstn)
            cur_state <= IDLE;
        else
            cur_state <= next_state;
    end

    always @ (cur_state or in) begin
        case (cur_state)
            IDLE : begin
                if (in)
                    next_state = S1;
                else
                    next_state = IDLE;
            end

            S1: begin
                if (in) 
                    next_state = S11;
                else 
                    next_state = IDLE;
            end

            S11: begin
                if (!in) 
                    next_state = S110;
                else 
                    next_state = S11;
            end

            S110 : begin
                if (in) 
                    next_state = S1101;
                else 
                    next_state = IDLE;
            end

            S1101 : begin
                if (!in)
                    next_state = S11010;
                else 
                    next_state = IDLE;
            end

            S11010: begin
                if (in)
                    next_state = S110101;
                else 
                    next_state = IDLE;
            end

            S110101: begin
                if (in) 
                    next_state = S1;
                else 
                    next_state = IDLE;
            end
        endcase
    end
endmodule
```

### 测试台

```verilog
module tb;
    reg clk, in, rstn;
    wire out;
    integer l_dly;

    always #10 clk = ~clk;

    det_110101 u0 ( .clk(clk), .rstn(rstn), .in(in), .out(out) );

    initial begin
        clk <= 0;
        rstn <= 0;
        in <= 0;

        repeat (5) 
            @ (posedge clk);
        rstn <= 1;

        @(posedge clk) in <= 1;
        @(posedge clk) in <= 1;
        @(posedge clk) in <= 0;
        @(posedge clk) in <= 1;
        @(posedge clk) in <= 0;
        @(posedge clk) in <= 1;
        @(posedge clk) in <= 1;
        @(posedge clk) in <= 1;
        @(posedge clk) in <= 0;
        @(posedge clk) in <= 1;
        @(posedge clk) in <= 0;
        @(posedge clk) in <= 1;

        #100 $finish;
    end
endmodule
```

仿真日志：

```verilog
T=10 in=0 out=0
T=30 in=0 out=0
T=50 in=0 out=0
T=70 in=0 out=0
T=90 in=0 out=0
T=110 in=1 out=0
T=130 in=1 out=0
T=150 in=0 out=0
T=170 in=1 out=0
T=190 in=0 out=0
T=210 in=1 out=0
T=230 in=1 out=1
T=250 in=1 out=0
T=270 in=0 out=0
T=290 in=1 out=0
T=310 in=0 out=0
T=330 in=1 out=0
T=350 in=1 out=1
T=370 in=1 out=0
T=390 in=1 out=0
T=410 in=1 out=0
```


