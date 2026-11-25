import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/identity_kind.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';

part 'identities.g.dart';

/// The anchor of every named thing (country, feature, person, organisation, office, law, event). Extending tables use this id as their own primary key; it never carries display text.
@JsonSerializable(includeIfNull: false)
class IdentityIdentities {
  const IdentityIdentities({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.kind,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final SharedIdentityKind kind;
  final DateTime updatedAt;
  final int version;

  factory IdentityIdentities.fromJson(Map<String, dynamic> json) => _$IdentityIdentitiesFromJson(json);

  Map<String, dynamic> toJson() => _$IdentityIdentitiesToJson(this);
}
