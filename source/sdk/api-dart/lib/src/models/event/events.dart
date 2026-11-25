import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/identity_kind.dart';
import 'package:mzizi_api/src/models/event/calendars.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/legal/provisions.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/reference/levels.dart';
import 'package:mzizi_api/src/models/shared/identity_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'events.g.dart';

/// A planned or recurring civic happening (Madaraka Day, budget reading). Its names are `identity.names`.
@JsonSerializable(includeIfNull: false)
class EventEvents {
  const EventEvents({
    this.basisProvisionId,
    this.calendarId,
    required this.code,
    this.countryId,
    required this.createdAt,
    this.deletedAt,
    this.featureId,
    required this.id,
    required this.identityKind,
    required this.kindTerm,
    this.levelId,
    this.organiserId,
    required this.updatedAt,
    required this.version,
  });
  final String? basisProvisionId;
  final String? calendarId;
  final String code;
  final String? countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? featureId;
  final String id;
  final SharedIdentityKind identityKind;
  final String kindTerm;
  final String? levelId;
  final String? organiserId;
  final DateTime updatedAt;
  final int version;

  factory EventEvents.fromJson(Map<String, dynamic> json) => _$EventEventsFromJson(json);

  Map<String, dynamic> toJson() => _$EventEventsToJson(this);
}
