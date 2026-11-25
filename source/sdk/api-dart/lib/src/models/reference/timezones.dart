import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/identity_kind.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/shared/identity_entity.dart';

part 'timezones.g.dart';

/// An IANA time zone.
@JsonSerializable(includeIfNull: false)
class ReferenceTimezones {
  const ReferenceTimezones({
    required this.code,
    this.countryId,
    required this.createdAt,
    this.deletedAt,
    required this.ianaName,
    required this.id,
    required this.identityKind,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final String? countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String ianaName;
  final String id;
  final SharedIdentityKind identityKind;
  final DateTime updatedAt;
  final int version;

  factory ReferenceTimezones.fromJson(Map<String, dynamic> json) => _$ReferenceTimezonesFromJson(json);

  Map<String, dynamic> toJson() => _$ReferenceTimezonesToJson(this);
}
