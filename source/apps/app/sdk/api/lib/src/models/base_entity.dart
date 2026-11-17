import 'package:json_annotation/json_annotation.dart';

part 'base_entity.g.dart';

/// Base Entity
@JsonSerializable(includeIfNull: false)
class BaseEntity {
  const BaseEntity({
    required this.createdAt,
    required this.id,
    required this.updatedAt,
    required this.version,
  });
  final DateTime createdAt;
  final String id;
  final DateTime updatedAt;
  final int version;

  factory BaseEntity.fromJson(Map<String, dynamic> json) => _$BaseEntityFromJson(json);

  Map<String, dynamic> toJson() => _$BaseEntityToJson(this);
}