import 'package:json_annotation/json_annotation.dart';

part 'partitioned_record.g.dart';

/// Base for append-only rows of partitioned tables: the table declares its own primary key.
@JsonSerializable(includeIfNull: false)
class SharedPartitionedRecord {
  const SharedPartitionedRecord({required this.createdAt, required this.id});
  final DateTime createdAt;
  final String id;

  factory SharedPartitionedRecord.fromJson(Map<String, dynamic> json) => _$SharedPartitionedRecordFromJson(json);

  Map<String, dynamic> toJson() => _$SharedPartitionedRecordToJson(this);
}
