import 'package:json_annotation/json_annotation.dart';

/// Scheme Shape
enum VocabularySchemeShape {
  @JsonValue('flat')
  flat,
  @JsonValue('graph')
  graph,
  @JsonValue('tree')
  tree,
}
