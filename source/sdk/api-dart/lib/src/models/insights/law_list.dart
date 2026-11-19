import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/law_instrument.dart';

part 'law_list.g.dart';

/// Law List
@JsonSerializable(includeIfNull: false)
class InsightsLawList {
  const InsightsLawList({required this.gaps, required this.instruments});
  final List<String> gaps;
  final List<InsightsLawInstrument> instruments;

  factory InsightsLawList.fromJson(Map<String, dynamic> json) => _$InsightsLawListFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsLawListToJson(this);
}
