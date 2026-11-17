import 'package:json_annotation/json_annotation.dart';

part 'association.g.dart';

/// Base for association rows: id, created timestamp and soft delete.
@JsonSerializable(includeIfNull: false)
class Association {
  const Association({
    required this.createdAt,
    this.deletedAt,
    required this.id,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;

  factory Association.fromJson(Map<String, dynamic> json) => _$AssociationFromJson(json);

  Map<String, dynamic> toJson() => _$AssociationToJson(this);
}