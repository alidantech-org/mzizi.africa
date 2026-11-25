import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/identity_kind.dart';
import 'package:mzizi_api/src/models/event/events.dart';
import 'package:mzizi_api/src/models/governance/office_terms.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/shared/identity_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'elections.g.dart';

/// An election or referendum. Its names are `identity.names`.
@JsonSerializable(includeIfNull: false)
class ElectionElections {
  const ElectionElections({
    this.authorityId,
    required this.code,
    required this.countryId,
    required this.createdAt,
    this.deletedAt,
    this.eventId,
    required this.fromYear,
    this.heldOn,
    required this.id,
    required this.identityKind,
    required this.kindTerm,
    this.parentId,
    required this.statusTerm,
    this.termId,
    required this.updatedAt,
    required this.version,
  });
  final String? authorityId;
  final String code;
  final String countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? eventId;
  final int fromYear;
  final DateTime? heldOn;
  final String id;
  final SharedIdentityKind identityKind;
  final String kindTerm;
  final String? parentId;
  final String statusTerm;
  final String? termId;
  final DateTime updatedAt;
  final int version;

  factory ElectionElections.fromJson(Map<String, dynamic> json) => _$ElectionElectionsFromJson(json);

  Map<String, dynamic> toJson() => _$ElectionElectionsToJson(this);
}
