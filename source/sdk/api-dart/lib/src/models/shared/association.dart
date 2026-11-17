import 'package:json_annotation/json_annotation.dart';

part 'association.g.dart';

/// Base for association rows: id, created timestamp and soft delete.
@JsonSerializable(includeIfNull: false)
class SharedAssociation {
  const SharedAssociation({required this.createdAt, this.deletedAt, required this.id});
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;

  factory SharedAssociation.fromJson(Map<String, dynamic> json) => _$SharedAssociationFromJson(json);

  Map<String, dynamic> toJson() => _$SharedAssociationToJson(this);
}
