import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';

part 'topic.g.dart';

/// Cross-domain discovery topic hierarchy; topics do not own domain records.
@JsonSerializable(includeIfNull: false)
class ReferenceTopic {
  const ReferenceTopic({
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

  factory ReferenceTopic.fromJson(Map<String, dynamic> json) => _$ReferenceTopicFromJson(json);

  Map<String, dynamic> toJson() => _$ReferenceTopicToJson(this);
}
