import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/vocabulary/mapping_kind.dart';
import 'package:mzizi_api/src/models/shared/association.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'mappings.g.dart';

/// Links between terms across schemes and countries. Loops in broader and narrower links are refused by Mzizi's write code.
@JsonSerializable(includeIfNull: false)
class VocabularyMappings {
  const VocabularyMappings({
    required this.createdAt,
    this.deletedAt,
    required this.fromId,
    required this.id,
    required this.kind,
    required this.toId,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String fromId;
  final String id;
  final VocabularyMappingKind kind;
  final String toId;

  factory VocabularyMappings.fromJson(Map<String, dynamic> json) => _$VocabularyMappingsFromJson(json);

  Map<String, dynamic> toJson() => _$VocabularyMappingsToJson(this);
}
