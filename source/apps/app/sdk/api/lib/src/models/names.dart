import 'package:json_annotation/json_annotation.dart';
import 'features.dart';
import 'validity_entity.dart';
import 'value.dart';

part 'names.g.dart';

/// An official, local, alternative, translated or historical name for a feature, with optional language, validity and provenance reference.
@JsonSerializable(includeIfNull: false)
class Names {
  const Names({
    required this.createdAt,
    this.deletedAt,
    required this.featureId,
    required this.id,
    this.languageTag,
    required this.name,
    required this.nameKindId,
    required this.updatedAt,
    this.validFrom,
    this.validUntil,
    required this.version,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String featureId;
  final String id;
  final String? languageTag;
  final String name;
  final String nameKindId;
  final DateTime updatedAt;
  final DateTime? validFrom;
  final DateTime? validUntil;
  final int version;

  factory Names.fromJson(Map<String, dynamic> json) => _$NamesFromJson(json);

  Map<String, dynamic> toJson() => _$NamesToJson(this);
}