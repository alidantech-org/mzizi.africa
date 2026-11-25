import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/identity_kind.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/shared/identity_entity.dart';

part 'apps.g.dart';

/// A Mzizi application: web, app or dev. Its names are `identity.names`.
@JsonSerializable(includeIfNull: false)
class ProductApps {
  const ProductApps({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.identityKind,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final SharedIdentityKind identityKind;
  final DateTime updatedAt;
  final int version;

  factory ProductApps.fromJson(Map<String, dynamic> json) => _$ProductAppsFromJson(json);

  Map<String, dynamic> toJson() => _$ProductAppsToJson(this);
}
