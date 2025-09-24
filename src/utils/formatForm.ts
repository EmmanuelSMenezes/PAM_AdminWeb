export function maskCpfCnpj(value: string) {
  if (value) {
    value = value?.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    if (value.length <= 11) {
      // CPF
      value = value?.replace(/(\d{3})(\d)/, '$1.$2'); // Adiciona o ponto depois dos 3 primeiros dígitos
      value = value?.replace(/(\d{3})(\d)/, '$1.$2'); // Adiciona o ponto depois dos 6 primeiros dígitos
      value = value?.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Adiciona o hífen depois dos 9 primeiros dígitos
    } else {
      // CNPJ
      value = value?.replace(/^(\d{2})(\d)/, '$1.$2'); // Adiciona o ponto depois dos 2 primeiros dígitos
      value = value?.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3'); // Adiciona o ponto depois dos 5 primeiros dígitos
      value = value?.replace(/\.(\d{3})(\d)/, '.$1/$2'); // Adiciona a barra depois dos 8 primeiros dígitos
      value = value?.replace(/(\d{4})(\d)/, '$1-$2'); // Adiciona o hífen depois dos 12 primeiros dígitos
    }
    value = value?.slice(0, 18); // Limita o valor a 14 dígitos (formato de CNPJ)
  }
  return value;
}

export function maskCpf(value: string) {
  if (value) {
    value = value?.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    value = value?.replace(/(\d{3})(\d)/, '$1.$2'); // Adiciona o ponto depois dos 3 primeiros dígitos
    value = value?.replace(/(\d{3})(\d)/, '$1.$2'); // Adiciona o ponto depois dos 6 primeiros dígitos
    value = value?.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Adiciona o hífen depois dos 9 primeiros dígitos
    value = value?.slice(0, 14); // Limita o valor a 11 dígitos (formato de CPF)
  }
  return value;
}
export function maskCnpj(value: string) {
  if (value) {
    value = value?.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    value = value?.replace(/^(\d{2})(\d)/, '$1.$2'); // Adiciona o ponto depois dos 2 primeiros dígitos
    value = value?.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3'); // Adiciona o ponto depois dos 5 primeiros dígitos
    value = value?.replace(/\.(\d{3})(\d)/, '.$1/$2'); // Adiciona a barra depois dos 8 primeiros dígitos
    value = value?.replace(/(\d{4})(\d)/, '$1-$2'); // Adiciona o hífen depois dos 12 primeiros dígitos
    value = value?.slice(0, 18); // Limita o valor a 14 dígitos (formato de CNPJ)
  }
  return value;
}

export function maskPhone(value: string) {
  value = value?.replace(/\D/g, ''); // Remove todos os caracteres não numéricos

  if (value.length === 10) {
    value = value?.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3'); // Formato para telefone fixo
  } else if (value?.length === 11) {
    value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3'); // Formato para telefone celular
  }

  return value;
}

export function maskZipCode(value: string) {
  value = value?.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
  value = value?.replace(/^(\d{5})(\d)/, '$1-$2'); // Adiciona o hífen depois dos primeiros 5 dígitos
  return value;
}
