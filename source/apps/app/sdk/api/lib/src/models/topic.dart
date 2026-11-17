import 'package:json_annotation/json_annotation.dart';
import 'coded_entity.dart';

part 'topic.g.dart';

/// Cross-domain discovery topic hierarchy; topics do not own domain records.
@JsonSerializable(includeIfNull: false)
class Topic {
  const Topic({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.label,
    this.parentId,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String label;
  final String? parentId;
  final DateTime updatedAt;
  final int version;

  factory Topic.fromJson(Map<String, dynamic> json) => _$TopicFromJson(json);

  Map<String, dynamic> toJson() => _$TopicToJson(this);
}