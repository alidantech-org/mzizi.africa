import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/page_window.dart';

part 'country_elections.g.dart';

/// Country Elections
@JsonSerializable(includeIfNull: false)
class ElectionCountryElections {
  const ElectionCountryElections({required this.countryId, this.limit, this.offset});
  final String countryId;
  final int? limit;
  final int? offset;

  factory ElectionCountryElections.fromJson(Map<String, dynamic> json) => _$ElectionCountryElectionsFromJson(json);

  Map<String, dynamic> toJson() => _$ElectionCountryElectionsToJson(this);
}
