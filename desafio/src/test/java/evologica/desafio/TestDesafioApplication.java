package evologica.desafio;

import org.springframework.boot.SpringApplication;

public class TestDesafioApplication {

	public static void main(String[] args) {
		SpringApplication.from(DesafioApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
