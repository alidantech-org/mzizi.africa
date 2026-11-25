import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';

part 'identity_entity.g.dart';

/// Base for identity-backed records: the id is the identity's id; with a unique code.
@JsonSerializable(includeIfNull: false)
class SharedIdentityEntity {
  const SharedIdentityEntity({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final DateTime updatedAt;
  final int version;

  factory SharedIdentityEntity.fromJson(Map<String, dynamic> json) => _$SharedIdentityEntityFromJson(json);

  Map<String, dynamic> toJson() => _$SharedIdentityEntityToJson(this);
}
