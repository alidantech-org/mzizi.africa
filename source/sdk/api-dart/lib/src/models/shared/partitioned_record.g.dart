// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'partitioned_record.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SharedPartitionedRecord _$SharedPartitionedRecordFromJson(Map<String, dynamic> json) =>
    SharedPartitionedRecord(createdAt: DateTime.parse(json['createdAt'] as String), id: json['id'] as String);

Map<String, dynamic> _$SharedPartitionedRecordToJson(SharedPartitionedRecord instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'id': instance.id,
};
