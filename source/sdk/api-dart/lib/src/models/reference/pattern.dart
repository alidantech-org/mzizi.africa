import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';

part 'pattern.g.dart';

/// Stable identity for a reusable, reviewed pattern definition.
@JsonSerializable(includeIfNull: false)
class ReferencePattern {
  const ReferencePattern({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.title,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String title;
  final DateTime updatedAt;
  final int version;

  factory ReferencePattern.fromJson(Map<String, dynamic> json) => _$ReferencePatternFromJson(json);

  Map<String, dynamic> toJson() => _$ReferencePatternToJson(this);
}
