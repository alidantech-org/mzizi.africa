import 'package:json_annotation/json_annotation.dart';

part 'partitioned_entity.g.dart';

/// Base for versioned records of partitioned tables: the table declares its own primary key.
@JsonSerializable(includeIfNull: false)
class SharedPartitionedEntity {
  const SharedPartitionedEntity({required this.createdAt, this.deletedAt, required this.id, required this.updatedAt, required this.version});
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final DateTime updatedAt;
  final int version;

  factory SharedPartitionedEntity.fromJson(Map<String, dynamic> json) => _$SharedPartitionedEntityFromJson(json);

  Map<String, dynamic> toJson() => _$SharedPartitionedEntityToJson(this);
}
