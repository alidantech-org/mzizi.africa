import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/date_precision.dart';
import 'package:mzizi_api/src/enums/shared/identity_kind.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/shared/identity_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'occurrences.g.dart';

/// A historical occurrence of significance (Kenya's independence, the 2010 constitution, devolution in 2013).
@JsonSerializable(includeIfNull: false)
class HistoryOccurrences {
  const HistoryOccurrences({
    required this.code,
    this.countryId,
    required this.createdAt,
    this.deletedAt,
    this.endsOn,
    this.fromYear,
    required this.id,
    required this.identityKind,
    required this.kindTerm,
    required this.precision,
    this.startsOn,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final String? countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final DateTime? endsOn;
  final int? fromYear;
  final String id;
  final SharedIdentityKind identityKind;
  final String kindTerm;
  final SharedDatePrecision precision;
  final DateTime? startsOn;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory HistoryOccurrences.fromJson(Map<String, dynamic> json) => _$HistoryOccurrencesFromJson(json);

  Map<String, dynamic> toJson() => _$HistoryOccurrencesToJson(this);
}
