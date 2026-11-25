import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/identity_kind.dart';
import 'package:mzizi_api/src/models/geography/place_detail_names.dart';
import 'package:mzizi_api/src/models/geography/place_detail_parents.dart';

part 'place_detail.g.dart';

/// Place Detail
@JsonSerializable(includeIfNull: false)
class GeographyPlaceDetail {
  const GeographyPlaceDetail({
    required this.code,
    this.endedOn,
    this.establishedOn,
    required this.featureId,
    this.fromYear,
    required this.identityKind,
    required this.kindTerm,
    required this.names,
    required this.parents,
    this.toYear,
  });
  final String code;
  final DateTime? endedOn;
  final DateTime? establishedOn;
  final String featureId;
  final int? fromYear;
  final SharedIdentityKind identityKind;
  final String kindTerm;
  final List<GeographyPlaceDetailNames> names;
  final List<GeographyPlaceDetailParents> parents;
  final int? toYear;

  factory GeographyPlaceDetail.fromJson(Map<String, dynamic> json) => _$GeographyPlaceDetailFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyPlaceDetailToJson(this);
}
