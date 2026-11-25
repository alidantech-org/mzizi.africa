import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/page_window.dart';

part 'place_offices.g.dart';

/// Place Offices
@JsonSerializable(includeIfNull: false)
class GovernancePlaceOffices {
  const GovernancePlaceOffices({required this.featureId, this.limit, this.offset});
  final String featureId;
  final int? limit;
  final int? offset;

  factory GovernancePlaceOffices.fromJson(Map<String, dynamic> json) => _$GovernancePlaceOfficesFromJson(json);

  Map<String, dynamic> toJson() => _$GovernancePlaceOfficesToJson(this);
}
