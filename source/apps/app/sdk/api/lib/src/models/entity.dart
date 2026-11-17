import 'package:json_annotation/json_annotation.dart';

part 'entity.g.dart';

/// Base for versioned records: id, version, created/updated timestamps and soft delete.
@JsonSerializable(includeIfNull: false)
class Entity {
  const Entity({
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.updatedAt,
    required this.version,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final DateTime updatedAt;
  final int version;

  factory Entity.fromJson(Map<String, dynamic> json) => _$EntityFromJson(json);

  Map<String, dynamic> toJson() => _$EntityToJson(this);
}