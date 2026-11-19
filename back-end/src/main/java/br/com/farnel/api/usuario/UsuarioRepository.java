package br.com.farnel.api.usuario;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

// O Spring Data cria a implementação sozinho a partir do nome dos métodos
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

	Optional<Usuario> findByEmail(String email);

	boolean existsByEmail(String email);
}
