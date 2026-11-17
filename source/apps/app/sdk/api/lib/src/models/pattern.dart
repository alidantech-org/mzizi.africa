import 'package:json_annotation/json_annotation.dart';
import 'coded_entity.dart';

part 'pattern.g.dart';

/// Stable identity for a reusable, reviewed pattern definition.
@JsonSerializable(includeIfNull: false)
class Pattern {
  const Pattern({
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

  factory Pattern.fromJson(Map<String, dynamic> json) => _$PatternFromJson(json);

  Map<String, dynamic> toJson() => _$PatternToJson(this);
}