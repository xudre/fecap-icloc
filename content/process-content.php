<?php

$result = [];
$file_name = null;

if (empty($argv[1]))
  exit('É preciso definir o tipo de contéudo que vai ser processado: sections | locations');

if (empty($argv[2]))
  exit('É preciso definir o arquivo CSV que será manipulado.');

switch ($argv[1]) {
  case 'sections':
    $data = [];
    $read = file_get_contents($argv[2]);

    $lines = explode("\r\n", $read);
    $linesCount = count($lines);

    $lastBloco     = null;
    $lastAndar     = null;
    $lastSala      = null;
    $lastHorario   = null;
    $lastSessao    = null;

    for ($i = 1; $i < $linesCount; $i++) {
      $line = trim($lines[$i]);

      if (empty($line)) continue;

      $pieces = explode(';', $line);

      for ($j = 0; $j < count($pieces); $j++)
        $pieces[$j] = str_replace(' |', '', trim($pieces[$j]));

      $bloco     = $pieces[0];
      $andar     = $pieces[1];
      $sala      = $pieces[2];
      $horario   = $pieces[3];
      $sessao    = $pieces[4];
      $trabalhos = $pieces[5];

      if (!empty($bloco))
        $lastBloco = $bloco;

      if (!empty($andar))
        $lastAndar = $andar;

      if (!empty($sala))
        $lastSala = $sala;

      if (!empty($horario))
        $lastHorario = $horario;

      if (!empty($sessao))
        $lastSessao = $sessao;

      $data["{$lastBloco}->{$lastAndar}->{$lastSala}->{$lastHorario}->{$lastSessao}->{$i}"] = $trabalhos;
    }

    foreach ($data as $key => $value) {
      $path = explode('->', $key);

      $deep = &$result;

      if (!isset($deep[$path[0]])) {
        $deep[$path[0]] = [
          'name' => $path[0],
          'floor' => []
        ];
      }

      $deep = &$deep[$path[0]]['floor'];

      if (!isset($deep[$path[1]])) {
        $deep[$path[1]] = [
          'name' => $path[1],
          'room' => []
        ];
      }

      $deep = &$deep[$path[1]]['room'];

      if (!isset($deep[$path[2]])) {
        $deep[$path[2]] = [
          'name' => $path[2],
          'timetable' => []
        ];
      }

      $deep = &$deep[$path[2]]['timetable'];

      if (!isset($deep[$path[3]])) {
        $deep[$path[3]] = [
          'name' => $path[3],
          'section' => []
        ];
      }

      $deep = &$deep[$path[3]]['section'];

      if (!isset($deep[$path[4]])) {
        $deep[$path[4]] = [
          'name' => $path[4],
          'work' => []
        ];
      }

      $deep = &$deep[$path[4]]['work'];

      $deep[] = $value;
    }

    function result_normalize (&$item, $key, $deep) {
      if (!isset($item['name'])) return;

      $analise = [ 'floor', 'room', 'timetable', 'section' ];

      foreach ($analise as $on) {
        if (isset($item[$on])) {
          $item[$on] = array_values($item[$on]);

          array_walk($item[$on], 'result_normalize', $deep++);
        }
      }
    }

    $result = array_values($result);

    array_walk($result, 'result_normalize', 0);

    $file_name = 'sessoes.json';

    break;
  case 'locations':

    break;
  default:
    exit('Tipo de conteúdo não reconhecido.');

    break;
}

if (!empty($file_name)) {
  unlink($file_name);

  $db = file_put_contents($file_name, json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}
