const canvas = document.getElementById("canvas");
        let ctx = canvas.getContext("2d");

        const window_height = window.innerHeight;
        const window_width = window.innerWidth;

        canvas.height = window_height;
        canvas.width = window_width;

        canvas.style.background = "#ff8";

        class Circle {
            constructor(x, y, radius, color, text, speed) {
                this.posX = x;
                this.posY = y;
                this.radius = radius;
                this.color = color;
                this.originalColor = color; // Color original (azul)
                this.text = text;
                this.speed = speed;

                this.dx = 1 * this.speed;
                this.dy = 1 * this.speed;
            }

            draw(context) {
                context.beginPath();
                context.strokeStyle = this.color;
                context.textAlign = "center";
                context.textBaseline = "middle";
                context.font = "20px Arial";
                context.fillText(this.text, this.posX, this.posY);
                context.lineWidth = 2;
                context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
                context.stroke();
                context.closePath();
            }

            update(context, circles) {
                this.draw(context);

                // Verificar colisiones con otros círculos
                for (let otherCircle of circles) {
                    if (this !== otherCircle) {
                        let distance = getDistance(this.posX, otherCircle.posX, this.posY, otherCircle.posY);
                        if (distance < (this.radius + otherCircle.radius)) {
                            // Colisión detectada, marcar ambas circunferencias como rojas
                            this.color = "red";
                            otherCircle.color = "red";

                            // Cambiar dirección de este círculo
                            let angle = Math.atan2(otherCircle.posY - this.posY, otherCircle.posX - this.posX);
                            this.dx = -Math.cos(angle) * this.speed;
                            this.dy = -Math.sin(angle) * this.speed;

                            // Cambiar dirección del otro círculo
                            let otherAngle = Math.atan2(this.posY - otherCircle.posY, this.posX - otherCircle.posX);
                            otherCircle.dx = -Math.cos(otherAngle) * otherCircle.speed;
                            otherCircle.dy = -Math.sin(otherAngle) * otherCircle.speed;

                            break; // Salir del bucle al detectar una colisión
                        }
                    }
                }

                // Restaurar color a azul si no hay colisiones
                if (!this.isColliding(circles)) {
                    this.color = this.originalColor; // Restaurar color original
                }

                // Actualizar posición
                this.posX += this.dx;
                this.posY += this.dy;

                // Revisar límites de la pantalla para rebote
                if ((this.posX + this.radius) > window_width || (this.posX - this.radius) < 0) {
                    this.dx = -this.dx;
                }

                if ((this.posY - this.radius) < 0 || (this.posY + this.radius) > window_height) {
                    this.dy = -this.dy;
                }
            }

            isColliding(circles) {
                for (let otherCircle of circles) {
                    if (this !== otherCircle) {
                        let distance = getDistance(this.posX, otherCircle.posX, this.posY, otherCircle.posY);
                        if (distance < (this.radius + otherCircle.radius)) {
                            return true;
                        }
                    }
                }
                return false;
            }
        }

        function getDistance(x1, x2, y1, y2) {
            let xDistance = x2 - x1;
            let yDistance = y2 - y1;
            return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
        }

        let circles = [];

        // Crear 20 círculos aleatorios
        for (let i = 0; i < 20; i++) {
            let radius = Math.random() * 50 + 20; // Radio entre 20 y 70
            let x = Math.random() * (window_width - radius * 2) + radius;
            let y = Math.random() * (window_height - radius * 2) + radius;
            let speed = 2; // Velocidad constante
            let text = (i + 1).toString(); // Números del 1 al 20
            let color = "blue"; // Todos azules al inicio

            let circle = new Circle(x, y, radius, color, text, speed);
            circles.push(circle);
        }

        function updateCircles() {
            requestAnimationFrame(updateCircles);
            ctx.clearRect(0, 0, window_width, window_height);

            for (let circle of circles) {
                circle.update(ctx, circles);
            }
        }

        // Iniciar la animación
        updateCircles();