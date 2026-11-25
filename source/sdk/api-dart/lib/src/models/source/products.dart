import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/identity_kind.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/shared/identity_entity.dart';
import 'package:mzizi_api/src/models/source/publishers.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'products.g.dart';

/// A publisher's series (the Economic Survey). Its titles are `identity.names`.
@JsonSerializable(includeIfNull: false)
class SourceProducts {
  const SourceProducts({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.identityKind,
    required this.kindTerm,
    this.publisherId,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final SharedIdentityKind identityKind;
  final String kindTerm;
  final String? publisherId;
  final DateTime updatedAt;
  final int version;

  factory SourceProducts.fromJson(Map<String, dynamic> json) => _$SourceProductsFromJson(json);

  Map<String, dynamic> toJson() => _$SourceProductsToJson(this);
}
