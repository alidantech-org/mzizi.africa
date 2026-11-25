import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/identity_kind.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/shared/identity_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'publishers.g.dart';

/// Who publishes; a publisher shares its organisation's identity (`official.entities`).
@JsonSerializable(includeIfNull: false)
class SourcePublishers {
  const SourcePublishers({
    this.classTerm,
    required this.code,
    this.countryId,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.identityKind,
    required this.kindTerm,
    required this.updatedAt,
    required this.version,
  });
  final String? classTerm;
  final String code;
  final String? countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final SharedIdentityKind identityKind;
  final String kindTerm;
  final DateTime updatedAt;
  final int version;

  factory SourcePublishers.fromJson(Map<String, dynamic> json) => _$SourcePublishersFromJson(json);

  Map<String, dynamic> toJson() => _$SourcePublishersToJson(this);
}
